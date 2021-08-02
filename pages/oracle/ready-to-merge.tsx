import { GetStaticProps } from "next";
import React, {useContext, useEffect, useState} from 'react';
import { IIssue } from "../../components/issue-list-item";
import ListIssues from "../../components/list-issues";
import GithubMicroService from "../../services/github-microservice";
import Oracle from "../../components/oracle";
import { mockReadyIssues } from "../../helpers/mockdata/mockIssues";
import {ApplicationContext} from '../../contexts/application';
import {changeLoadState} from '../../contexts/reducers/change-load-state';

export default function ReadyToMergeIssues() {
  const {dispatch} = useContext(ApplicationContext);
  const [issues, setIssues] = useState<IIssue[]>(mockReadyIssues);

  function getIssues() {
    dispatch(changeLoadState(true))
    GithubMicroService.getIssuesState({filterState: `ready`})
                      .then(setIssues)
                      .catch((error) => {
                        console.log('Error', error)
                      })
                      .finally(() => {
                        dispatch(changeLoadState(false))
                      });
  }

  useEffect(getIssues, []);

  return (
    <Oracle buttonPrimaryActive={false}>
      <ListIssues listIssues={issues} />
    </Oracle>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
