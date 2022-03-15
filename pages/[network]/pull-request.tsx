import React, { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next/types'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Button from 'components/button'
import Comment from 'components/comment'
import GithubLink from 'components/github-link'
import NothingFound from 'components/nothing-found'
import CustomContainer from 'components/custom-container'
import PullRequestHero from 'components/pull-request-hero'
import CreateReviewModal from 'components/create-review-modal'

import { ApplicationContext } from 'contexts/application'
import { changeLoadState } from 'contexts/reducers/change-load-state'


import useMergeData from 'x-hooks/use-merge-data'


import { IssueData, pullRequest } from 'interfaces/issue-data'
import useApi from 'x-hooks/use-api'
import { addToast } from 'contexts/reducers/add-toast'
import { useTranslation } from 'next-i18next'
import useNetwork from 'x-hooks/use-network'
import ReadOnlyButtonWrapper from 'components/read-only-button-wrapper'
import { useRepos } from 'contexts/repos'
import { useIssue } from 'contexts/issue'

export default function PullRequest() {
  const {
    dispatch,
    state: { githubLogin, currentAddress }
  } = useContext(ApplicationContext)

  const router = useRouter()
  const {activeRepo} = useRepos()
  const {activeIssue} = useIssue()
  
  const { createReviewForPR } = useApi()
  const [showModal, setShowModal] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [pullRequest, setPullRequest] = useState<pullRequest>()
  const { getMergedDataFromPullRequests } = useMergeData()
  const { t } = useTranslation(['common', 'pull-request'])
  const { network } = useNetwork()
  const { prId, review } = router.query;

  function loadData() {
    dispatch(changeLoadState(true))
    if (!prId) return;
    const currentPR = activeIssue?.pullRequests.find((pr) => +pr?.githubId === +prId);
    setPullRequest(currentPR)
    dispatch(changeLoadState(false))
  }

  function handleCreateReview({ body }) {
    // setIsExecuting(true)

    // createReviewForPR(String(issueId), String(prId), githubLogin, body, network?.name)
    //   .then((response) => {
    //     dispatch(
    //       addToast({
    //         type: 'success',
    //         title: t('actions.success'),
    //         content: t('pull-request:actions.review.success')
    //       })
    //     )

    //     setPullRequest({...pullRequest, comments: [...pullRequest.comments, response.data]})
        
    //     setIsExecuting(false)
    //     handleCloseModal()
    //   })
    //   .catch((error) => {
    //     dispatch(
    //       addToast({
    //         type: 'danger',
    //         title: t('actions.failed'),
    //         content: t('pull-request:actions.review.error')
    //       })
    //     )

    //     setIsExecuting(false)
    //   })
  }

  function handleShowModal() {
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
  }

  useEffect(()=>{loadData()}, [])

  useEffect(() => {
    if (review && pullRequest){
      setShowModal(true)
    }
  }, [review, pullRequest])

  return (
    <>
      <PullRequestHero currentPullRequest={pullRequest} />
      <CustomContainer>
        <div className="mt-3">
          <div className="row align-items-center bg-shadow border-radius-8 px-3 py-4">
            <div className="col-8">
              <span className="caption-large text-uppercase">
                {t("pull-request:review", {
                  count: pullRequest?.comments?.length,
                })}
              </span>
            </div>

            <div className="col-2 p-0 d-flex justify-content-center">
              {currentAddress && githubLogin && pullRequest?.state === "open" && (
                <ReadOnlyButtonWrapper>
                  <Button
                    className="read-only-button"
                    onClick={handleShowModal}
                  >
                    {t("actions.make-a-review")}
                  </Button>
                </ReadOnlyButtonWrapper>
              )}
            </div>

            <div className="col-2 p-0">
              <GithubLink
                repoId={String(activeRepo?.id)}
                forcePath={activeRepo?.githubPath}
                hrefPath={`pull/${pullRequest?.githubId || ""}`}
              >
                {t("actions.view-on-github")}
              </GithubLink>
            </div>

            <div className="col-12 mt-4">
              {(pullRequest?.comments?.length > 0 &&
                React.Children.toArray(pullRequest?.comments?.map((comment, index) => (
                  <Comment comment={comment} key={index} />
                )))) || (
                <NothingFound
                  description={t("pull-request:errors.no-reviews-found")}
                />
              )}
            </div>
          </div>
        </div>
      </CustomContainer>

      <CreateReviewModal
        show={showModal}
        onCloseClick={handleCloseModal}
        issue={activeIssue}
        pullRequest={pullRequest}
        onConfirm={handleCreateReview}
        isExecuting={isExecuting}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      session: await getSession(),
      ...(await serverSideTranslations(locale, ['common', 'pull-request'])),
    },
  };
};