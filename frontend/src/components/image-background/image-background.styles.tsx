import styled from "styled-components";

export const StyledImageBackground = styled.div<{ 
  width?: number, 
  height?: number,
  src: string
}>`
  width: ${props => (props.width ? `${props.width}px` : "auto")};
  height: ${props => (props.height ? `${props.height}px` : "auto")};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;
