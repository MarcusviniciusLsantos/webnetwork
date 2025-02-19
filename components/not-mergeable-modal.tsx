import { ApplicationContext } from '@contexts/application'
import { addToast } from '@contexts/reducers/add-toast'
import useApi from '@x-hooks/use-api'
import { useContext, useEffect, useState } from 'react'

import Button from './button'
import GithubLink from './github-link'
import Modal from './modal'

export default function NotMergeableModal({
  currentGithubLogin,
  currentAddress,
  issue,
  pullRequest,
  mergeProposal,
  issuePRs,
  isFinalized = false,
  isCouncil = false
}) {
  const { dispatch } = useContext(ApplicationContext)
  const [isVisible, setVisible] = useState(false)
  const [mergeState, setMergeState] = useState('')
  const isIssueOwner = issue?.creatorGithub === currentGithubLogin
  const isPullRequestOwner = pullRequest?.githubLogin === currentGithubLogin
  const isProposer =
    mergeProposal?.proposalAddress?.toLowerCase() === currentAddress
  const hasPRMerged = !!issuePRs?.find((pr) => pr.merged === true)
  const { mergeClosedIssue } = useApi()

  function handleModalVisibility() {
    if (!pullRequest || !issuePRs?.length || mergeState === 'success') return

    if (hasPRMerged || (pullRequest.isMergeable && !isFinalized) || !(isIssueOwner || isPullRequestOwner || isCouncil || isProposer)) {
      setVisible(false)
    } else if (isIssueOwner || isPullRequestOwner || isCouncil || isProposer)
      setVisible(pullRequest.state === 'open')

  }

  function handleRetryMerge() {
    if (mergeState == 'error') return false

    setMergeState('loading')

    mergeClosedIssue(
      issue?.issueId,
      pullRequest.githubId,
      mergeProposal._id,
      currentAddress
    )
      .then((response) => {
        dispatch(
          addToast({
            type: 'success',
            title: 'Success',
            content: 'Pull Request merged'
          })
        )

        setMergeState('success')
        setVisible(false)
      })
      .catch((error) => {
        dispatch(
          addToast({
            type: 'danger',
            title: 'Failed',
            content: error.response.data.message
          })
        )

        setMergeState('error')
      })
  }

  useEffect(handleModalVisibility, [
    currentGithubLogin,
    currentAddress,
    issue,
    pullRequest,
    mergeProposal,
    isFinalized,
    isCouncil,
    mergeState,
    issuePRs
  ])

  return (
    <Modal
      show={isVisible}
      title="Merging Issue"
      titlePosition="center"
      onCloseClick={() => setVisible(false)}
      centerTitle
    >
      <div>
        <div className="d-flex justify-content-center m-2 text-center">
          <p className="h4 mb-2 text-white">
            {(isFinalized &&
              'This issue was closed and distributed but the code was unable to be merged.') ||
              ''}

            {(!isFinalized &&
              'This proposal has github conflicts and cannot be merged. Please, fix it before doing so.') ||
              ''}
          </p>
        </div>
        <div className="d-flex justify-content-center">
          {isCouncil && isFinalized && (
            <Button
              color={`${
                (mergeState === 'error' && 'transparent') || 'primary'
              }`}
              textClass={`${
                (mergeState === 'error' && 'text-danger') || undefined
              }`}
              disabled={mergeState !== ''}
              onClick={handleRetryMerge}
            >
              {mergeState === 'error' ? 'Merge failed' : 'Retry Merge'}
              {mergeState === 'loading' && (
                <span className="spinner-border spinner-border-xs ml-1" />
              )}
            </Button>
          )}
          <GithubLink
            forcePath={issue?.repo}
            hrefPath={`pull/${pullRequest?.githubId || ''}/conflicts`}
            color="primary">
            Go to Pull Request
          </GithubLink>
          <Button color="dark-gray" onClick={() => setVisible(false)}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}
