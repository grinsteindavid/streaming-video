import React from 'react';
import styled from '@emotion/styled';

type ButtonVariant = 'primary' | 'secondary' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  hasIcon: boolean;
  iconPosition: 'left' | 'right';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  flex-direction: ${({ iconPosition }) => iconPosition === 'right' ? 'row-reverse' : 'row'};
  
  /* Size styles */
  ${({ size, theme }) =>
    size === 'small' &&
    `
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.typography.fontSizes.xs};
  `}
  
  ${({ size, theme }) =>
    size === 'medium' &&
    `
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.typography.fontSizes.sm};
  `}
  
  ${({ size, theme }) =>
    size === 'large' &&
    `
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    font-size: ${theme.typography.fontSizes.md};
  `}
  
  /* Variant styles */
  ${({ variant, theme }) =>
    variant === 'primary' &&
    `
    background-color: ${theme.colors.accent.primary};
    color: ${theme.colors.text.primary};
    border: none;
    
    &:hover {
      background-color: ${theme.colors.accent.primary}cc; /* 80% opacity */
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      background-color: ${theme.colors.accent.primary}66; /* 40% opacity */
      cursor: not-allowed;
      transform: none;
    }
  `}
  
  ${({ variant, theme }) =>
    variant === 'secondary' &&
    `
    background-color: transparent;
    color: ${theme.colors.accent.primary};
    border: 1px solid ${theme.colors.accent.primary};
    
    &:hover {
      background-color: ${theme.colors.accent.primary}1a; /* 10% opacity */
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      color: ${theme.colors.accent.primary}66; /* 40% opacity */
      border-color: ${theme.colors.accent.primary}66; /* 40% opacity */
      cursor: not-allowed;
      transform: none;
    }
  `}
  
  ${({ variant, theme }) =>
    variant === 'text' &&
    `
    background-color: transparent;
    color: ${theme.colors.accent.primary};
    border: none;
    padding-left: ${theme.spacing.sm};
    padding-right: ${theme.spacing.sm};
    
    &:hover {
      text-decoration: underline;
    }
    
    &:disabled {
      color: ${theme.colors.accent.primary}66; /* 40% opacity */
      cursor: not-allowed;
      text-decoration: none;
    }
  `}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      hasIcon={!!icon}
      iconPosition={iconPosition}
      {...props}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );
};
