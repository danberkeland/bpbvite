import React from "react";

import { OverlayPanel } from 'primereact/overlaypanel';
import { AddProdOverlayBody } from './AddProdOverlayBody'


import styled from "styled-components";

const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  border: 1px solid lightgray;
  padding: 10px 10px;
  margin: 10px auto 10px auto;
  box-sizing: border-box;
`;



export const AddProduct = ({ op }) => {


  return (

    <OverlayPanel ref={op} id="overlay_panel" style={{ width: '300px' }} className="overlaypanel-demo">

      <BasicContainer>
        <AddProdOverlayBody />
      </BasicContainer>

    </OverlayPanel>


  );
};
