import React from 'react';
import { Text, Pressable, ActivityIndicator, PressableProps } from 'react-native';
import { cn } from '@/utils/cn';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'success' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    className?: string;
    textClassName?: string;
}

export function Button({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className,
    textClassName,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'rounded-2xl items-center justify-center flex-row';

    const variants = {
        primary: 'bg-primary shadow-lg',
        success: 'bg-green-500 shadow-lg',
        danger: 'bg-red-500 shadow-lg',
        outline: 'bg-transparent border border-border',
        ghost: 'bg-transparent',
    };

    const sizes = {
        sm: 'py-2 px-4',
        md: 'py-3 px-6',
        lg: 'py-4 px-8',
    };

    const textBaseStyles = 'font-bold text-center';

    const textVariants = {
        primary: 'text-white',
        success: 'text-white',
        danger: 'text-white',
        outline: 'text-foreground',
        ghost: 'text-primary',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-xl',
    };

    return (
        <Pressable
            className={cn(baseStyles, variants[variant], sizes[size], disabled && 'opacity-50', className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? 'black' : 'white'} />
            ) : (
                <>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
                            color={variant === 'outline' || variant === 'ghost' ? 'black' : 'white'}
                            className="mr-2"
                        />
                    )}
                    <Text className={cn(textBaseStyles, textVariants[variant], textSizes[size], textClassName)}>
                        {title}
                    </Text>
                </>
            )}
        </Pressable>
    );
}
