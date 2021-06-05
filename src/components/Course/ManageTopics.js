import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

//bootstrap components
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/esm/FormGroup";
import ListGroup from "react-bootstrap/ListGroup";

import {SERVER_ADDRESS} from "../../constants/constants";

import Topic from "./BrowsedTopic";
import { useAuth } from "../../context/auth";

import {LIST_FONT_COLOR, LIST_BACKGROUND_COLOR} from "../../constants/constants";

const BrowsedTopics = React.memo((props) => {
  const [topics, setTopics] = useState([]);
  const [prevTopic, setPrevTopic] = useState();
  const [currentTopics, setCurrentTopics] = useState([]);
  const searchValueRef = useRef("");
  const inputRef = useRef();
  const { authToken } = useAuth();
  useEffect(() => {
    
    axios
      .get(SERVER_ADDRESS+"get-topics-manage", {
        params: {
          areaId:"%",
          manage:"true"
        },
        headers: {
          Authorization: "Bearer " + authToken,
        },
      })
      .then((topics) => {
        setTopics(topics.data);
        setCurrentTopics(topics.data);
      });
  }, [props.selectedArea, props.showSearch, authToken]);

  useEffect(() => {
   
      inputRef.current.focus();
    
  }, [topics]);

  const searchHandler = (event) => {
    searchValueRef.current = event.target.value;

    const searchResult = currentTopics.filter( (element) => element.name.toLowerCase().includes(searchValueRef.current.toLowerCase()));
    searchResult?setTopics(searchResult):setTopics([]);

    // axios
    //   .get(SERVER_ADDRESS+"get-topics-search", {
    //     params: { name: searchValueRef.current },
    //   })
    //   .then((tops) => {
    //     setTopics(tops.data);
    //   });
  };

  const Search = () => {
   
      return (
        <FormGroup>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-sm">
                Search:
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Small"
              onChange={searchHandler}
              value={searchValueRef.current}
              ref={inputRef}
              aria-describedby="inputGroup-sizing-sm"
            />
          </InputGroup>
        </FormGroup>
      );
    
  };

  const selectTopics = (event) => {
    props.onSelectedTopic(event.target.id);
    if (prevTopic) {
      prevTopic.style.backgroundColor = "initial";
      prevTopic.style.color = "initial";
    }
    event.target.style.backgroundColor = LIST_BACKGROUND_COLOR;
    event.target.style.color = LIST_FONT_COLOR;
    setPrevTopic(event.target);
    event.preventDefault();
  };

  const topicsToDisplay = topics.map((topic) => {
    
    return (
      <Topic
        id={topic.id}
        name={topic.name}
        key={topic.id + topic.name}
        teaser ={topic.teaser}
        selectTopic={selectTopics}
      />
    );
  });

  return (
    <Form style={{ height: 100 + "%", width: 100 + "%" }}>
      <Search />
      <ListGroup
        style={{ overflow: "auto", maxHeight: 100 + "%", height: 100 + "%" }}
      >
        {topicsToDisplay}
      </ListGroup>
    </Form>
  );
});

export default BrowsedTopics;
