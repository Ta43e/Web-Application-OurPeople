import styled from "styled-components";

export const StyledImage = styled.img<{ 
  width?: number, 
  height?: number
}>`
  width: ${props => (props.width ? `${props.width}px` : "auto")};
  height: ${props => (props.height ? `${props.height}px` : "auto")};
`;
