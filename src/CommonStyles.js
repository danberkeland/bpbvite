import styled from "styled-components";


export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid lightblue;
  padding: 20px 20px;
  box-sizing: border-box;
  position: absolute;
  top: 40%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
`;


export const MainWrapper = styled.div`
  float: left;
  width: 100%;

  @media only screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 2.5fr;
  }
`;


export const InfoWrapper = styled.div`
  float: left;
  width: 100%;
`;

export const Title = styled.h2`
  padding: 0;
  margin: 10px 10px;
  color: rgb(66, 97, 201);
`;

export const SubInfo = styled.div`
  padding: 0;
  margin: 8px 10px;
  color: darkgray;
`;


export const Website = styled.h3`

  padding: 0;
  margin: auto;
  color: rgb(66, 97, 201);
`;

