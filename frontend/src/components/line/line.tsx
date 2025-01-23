import { FC, HtmlHTMLAttributes, ReactNode, memo } from "react";
import { StyledLine } from "./line.styles";

export type LineProps = {
    height?: number;
    width?: number;
    color?: string;
} & HtmlHTMLAttributes<HTMLElement>;


export const Line: FC<LineProps> = memo(({ height, width, color, ...rest }) => {
    return <StyledLine
        height={height}
        width={width}
        color={color}
        { ...rest}
    />
})

