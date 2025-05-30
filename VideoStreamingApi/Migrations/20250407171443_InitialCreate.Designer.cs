﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using VideoStreamingApi.Infrastructure.Data;

#nullable disable

namespace VideoStreamingApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250407171443_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.Rating", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("RatingValue")
                        .HasColumnType("integer");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("VideoId");

                    b.ToTable("Ratings");
                });

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.Video", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)");

                    b.Property<int>("Duration")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<string>("Tags")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ThumbnailUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<DateTime>("UploadDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Videos");
                });

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.VideoFile", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("Size")
                        .HasColumnType("bigint");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("VideoId");

                    b.ToTable("VideoFiles");
                });

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.ViewStat", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("uuid");

                    b.Property<int>("WatchDuration")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("VideoId");

                    b.ToTable("ViewStats");
                });

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.Rating", b =>
                {
                    b.HasOne("VideoStreamingApi.Domain.Entities.Video", "Video")
                        .WithMany("Ratings")
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Video");
                });

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.VideoFile", b =>
                {
                    b.HasOne("VideoStreamingApi.Domain.Entities.Video", "Video")
                        .WithMany("VideoFiles")
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Video");
                });

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.ViewStat", b =>
                {
                    b.HasOne("VideoStreamingApi.Domain.Entities.Video", "Video")
                        .WithMany("ViewStats")
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Video");
                });

            modelBuilder.Entity("VideoStreamingApi.Domain.Entities.Video", b =>
                {
                    b.Navigation("Ratings");

                    b.Navigation("VideoFiles");

                    b.Navigation("ViewStats");
                });
#pragma warning restore 612, 618
        }
    }
}
