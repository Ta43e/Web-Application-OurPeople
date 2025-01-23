import { FC, HtmlHTMLAttributes, ReactNode } from "react";
import { StyledSurface } from "./surface.styled";

export type SurfaceProps = {
    borderRadius?: string;
    padding?: string;
    children?: ReactNode;
    themeColor?: string;
    img?: string;
    width?: number | string;
    borderColor? : string;
    height?: number;
    shadow?: string;
} & HtmlHTMLAttributes<HTMLElement>;

export const Surface: FC<SurfaceProps> = ({ width, height, img, borderRadius, padding, children, borderColor, themeColor, shadow, ...rest}) => {
    return <StyledSurface shadow={shadow} borderColor={borderColor} width={width} height={height} img={img} themeColor={themeColor} borderRadius={borderRadius} padding={padding} {...rest}>{children}</StyledSurface>;
};