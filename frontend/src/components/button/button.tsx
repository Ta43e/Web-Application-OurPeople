import { FC, HtmlHTMLAttributes, ReactNode, memo } from "react";
import { StyledButton } from "./button.styles";

export type ButtonProps = {
    themeColor?: string;
    borderColor?: string;
    width?: number | string;
    children?: ReactNode;
    height?: number | string;
    onClick?: () => void;
} & HtmlHTMLAttributes<HTMLElement>;

export const Button: FC<ButtonProps> = memo(({themeColor,width,height,onClick,children, ...rest }) => {
    return <StyledButton
        themeColor={themeColor}
        height={height}
        width={width}
        onClick={onClick}
        { ...rest}
    >
        {children}
    </StyledButton>
})

