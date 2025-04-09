# CDN module for Video Streaming Platform

# Create CloudFront origin access identity for S3 bucket access
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.project_name}-${var.environment} video streaming platform"
}

# Create CloudFront distribution for video content delivery
resource "aws_cloudfront_distribution" "video_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Use only North America and Europe edge locations
  comment             = "${var.project_name}-${var.environment} video streaming platform"
  wait_for_deployment = false

  # Main S3 origin for video content
  origin {
    domain_name = var.s3_bucket_domain
    origin_id   = "S3-${var.s3_bucket_id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  # Default cache behavior for most content
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-${var.s3_bucket_id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Cache behavior for HLS streaming files
  ordered_cache_behavior {
    path_pattern     = "/videos/*/hls/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-${var.s3_bucket_id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior for thumbnail images
  ordered_cache_behavior {
    path_pattern     = "/videos/*/thumbnail.jpg"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-${var.s3_bucket_id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400    # 24 hours for thumbnails
    max_ttl                = 31536000 # 1 year
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior for subtitle files
  ordered_cache_behavior {
    path_pattern     = "/videos/*/subtitles/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-${var.s3_bucket_id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400    # 24 hours for subtitles
    max_ttl                = 31536000 # 1 year
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Block access to raw video files
  ordered_cache_behavior {
    path_pattern     = "*.mp4"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-${var.s3_bucket_id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    viewer_protocol_policy = "redirect-to-https"
    
    # Return 403 Forbidden for raw video files
    response_headers_policy_id = aws_cloudfront_response_headers_policy.block_access.id
  }

  # Geo restriction settings
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL certificate settings
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-cf-distribution"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create response headers policy to block access to raw video files
resource "aws_cloudfront_response_headers_policy" "block_access" {
  name    = "${var.project_name}-${var.environment}-block-access"
  comment = "Policy to block access to raw video files"

  custom_headers_config {
    items {
      header   = "X-Content-Type-Options"
      override = true
      value    = "nosniff"
    }
  }

  security_headers_config {
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "same-origin"
      override        = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
  }
}

# Update S3 bucket policy with CloudFront OAI
resource "aws_s3_bucket_policy" "allow_cloudfront_access" {
  bucket = var.s3_bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action    = "s3:GetObject"
        Resource  = "${var.s3_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.video_distribution.arn
          }
        }
      }
    ]
  })
}
