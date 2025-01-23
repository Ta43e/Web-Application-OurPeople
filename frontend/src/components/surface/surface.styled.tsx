import styled from "styled-components";
import { SurfaceProps } from "./surface";
import { theme } from "../../themes/theme";

export const StyledSurface = styled.div<SurfaceProps>`
  border-radius: ${({ borderRadius }) => borderRadius || '7px'};
  border: ${({ borderColor }) => borderColor ? `1px solid ${borderColor}` : 0};
  padding: ${({ padding }) => padding || '10px'};
  background-color:${({ themeColor }) =>  themeColor ? themeColor : 'white'};
  box-shadow: ${({ shadow }) => shadow ? shadow : '0px 0px 5px rgba(0, 0, 0, 0.2)'};
  box-sizing: border-box;
  width: ${props => {
    if(props.width) return `${props.width}px`
    else  return `100%`
  }};
  height: ${props => {
    if(props.height) return `${props.height}px`
    else return `auto`
  }};
`;