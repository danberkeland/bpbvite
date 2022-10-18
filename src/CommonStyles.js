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

export const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;

export const FlexSpaceBetween = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 95%;
  margin: 5px 10px 20px 10px;
  padding: 5px 5px 10px 5px;
`;

export const DefLabel = styled.div`
  color: red;
`;
