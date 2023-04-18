import React, { useState } from "react";

import "primeflex/primeflex.css";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

import {
  getCompList,
  getFlourWeight,
  getItemPercent,
  handleInput,
} from "./utils";

import styled from "styled-components";

const AddButtons = styled.div`
  display: flex;
  width: 60%;
  margin: auto;
  padding: 10px;
  justify-content: space-around;
`;

const clonedeep = require("lodash.clonedeep");

const postIngs = [
  { postIng: "Multigrains" },
  { postIng: "Butter" },
  { postIng: "Olives" },
  { postIng: "Bleu Cheese" },
  { postIng: "Jalapenos" },
  { postIng: "Cheddar" },
  { postIng: "Croix Scraps" },
];

const Post = ({
  selectedDough,
  doughComponents,
  setDoughComponents,
  setIsModified,
}) => {
  const [selectedPost, setSelectedPost] = useState("");

  const posts = getCompList("post", doughComponents, selectedDough);

  const handlePostPick = (e) => {
    setSelectedPost(e.value.postIng);
  };

  const handleAddPost = () => {
    let listToMod = clonedeep(doughComponents);
    let newItem = {
      dough: selectedDough.doughName,
      componentType: "post",
      componentName: selectedPost,
      amount: 0,
    };

    listToMod.push(newItem);
    setDoughComponents(listToMod);
  };

  const directWeight = (e) => {
    let fl = getFlourWeight(e, doughComponents, selectedDough);
    let percent = getItemPercent(e, doughComponents, selectedDough);
    return (fl * percent * 0.01).toFixed(2);
  };

  return (
    <React.Fragment>
      <div className="datatable-templating-demo">
        <div className="card">
          {posts.length > 0 ? (
            <DataTable value={posts} className="p-datatable-sm">
              <Column field="ing" header="Post Mix"></Column>
              <Column
                className="p-text-center"
                header="% flour weights"
                body={(e) =>
                  handleInput(
                    e,
                    doughComponents,
                    selectedDough,
                    setDoughComponents,
                    setIsModified
                  )
                }
              ></Column>
              <Column
                className="p-text-center"
                header="Weight"
                body={directWeight}
              ></Column>
              <Column
                className="p-text-center"
                header="Total %"
                body={(e) => getItemPercent(e, doughComponents, selectedDough)}
              ></Column>
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      <AddButtons className="addPost">
        <Dropdown
          id="postIng"
          optionLabel="postIng"
          options={postIngs}
          style={{ width: "50%" }}
          onChange={handlePostPick}
          placeholder={selectedPost !== "" ? selectedPost : "Select a Post Mix"}
        />
        <Button
          className="p-button-rounded p-button-outlined"
          icon="pi pi-plus"
          onClick={handleAddPost}
        />
      </AddButtons>
    </React.Fragment>
  );
};

export default Post;
