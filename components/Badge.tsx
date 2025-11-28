import React from 'react';
import { Text, Pressable, PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface BadgeProps extends PressableProps {
    label: string;
    onRemove?: () => void;
    variant?: 'default' | 'outline';
    active?: boolean;
}

export function Badge({ label, onRemove, variant = 'default', active = false, className, ...props }: BadgeProps) {
    const theme = useTheme();

    return (
        <Pressable
            className={cn(
                'px-3 py-1 rounded-full flex-row items-center',
                variant === 'default' && 'bg-card border border-border',
                variant === 'outline' && 'bg-transparent border border-border',
                active && 'bg-primary border-primary',
                className,
            )}
            disabled={!onRemove && !props.onPress}
            {...props}
        >
            <Text className={cn('text-foreground mr-1', active && 'text-white')}>{label}</Text>
            {onRemove && (
                <Pressable onPress={onRemove}>
                    <Ionicons name="close-circle" size={16} color={active ? 'white' : theme.colors.text} />
                </Pressable>
            )}
        </Pressable>
    );
}
