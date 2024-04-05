import styled from "styled-components";

export const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

export const WholeBoxPhone = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: auto;
  padding: 0 0 100px 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
`;

export const ButtonWrapper = styled.div`
  margin-block: .5rem;
  width: fit-content;
  font-family: "Montserrat", sans-serif;
  display: flex;
  //width: 60%;
  flex-direction: row;
  justify-content: space-between;
  align-content: left;

  //background: #ffffff;
`;

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
  padding: 5px;
`;


export const h1Style = {
  fontWeight: "bold", 
  marginBottom: "2rem"
}

export const h2Style = {
  margin: ".5rem 0 .25rem 0",
  fontWeight: "bold",
}

export const h3Style = {
  fontWeight: "bold",
  color: 'hsl(37, 100%, 10%)',
}
