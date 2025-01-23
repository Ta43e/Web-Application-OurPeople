import styled from "styled-components";

export type StyledButtonProps = {
  themeColor?: string;
  borderColor?: string;
  width?: number | string;
  height?: number | string;
};

export const StyledButton = styled.button<StyledButtonProps>`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: ${({ themeColor }) => themeColor || "white"};
  border: 1px solid ${({ borderColor }) => borderColor || "black"};

  width: ${props => {
    if(props.width){
      if(typeof props.width === "number") return props.width + "px"; 
      else return props.width;
    }
    else return "auto";
  }};
  height: ${props => {
    if(props.height){
      if(typeof props.height === "number") return props.height + "px"; 
      else return props.height;
    }
    else return "auto";
  }};
  border-radius: 5px;
`;
