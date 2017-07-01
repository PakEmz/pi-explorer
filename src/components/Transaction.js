import React from 'react'
import {Grid, Row, Table, Panel} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {
  formatMessage,
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl'
import PropTypes from 'prop-types'

import {handleFetchDataFailure} from '../lib/Utils'
import {withServer} from './shared/HOCs'
import OperationList from './OperationList'
import {titleWithJSONButton} from './shared/TitleWithJSONButton'

class Transaction extends React.Component {
  static defaultProps = {
    operations: [],
  }

  render() {
    const {id, urlFn, fee, ledger, memoType, opCount, time} = this.props

    if (!id) return null

    return (
      <Grid>
        <Row>
          <Panel
            header={titleWithJSONButton(
              id,
              formatMessage({id: 'transaction.details'}),
              urlFn
            )}
          >
            <Table className="table-hover table-condensed" fill>
              <tbody>
                <tr>
                  <td><FormattedMessage id="hash" /></td>
                  <td>{id}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="time" /></td>
                  <td>
                    <FormattedDate value={time} />&nbsp;
                    <FormattedTime value={time} />
                  </td>
                </tr>
                <tr>
                  <td>Fee</td>
                  <td>{fee}{' '}stroops</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="ledger" /></td>
                  <td>
                    <Link to={`/ledger/${ledger}`}>{ledger}</Link>
                  </td>
                </tr>
                <tr>
                  <td>Memo Type</td>
                  <td>{memoType}</td>
                </tr>
              </tbody>
            </Table>
          </Panel>
        </Row>
        <Row>
          <h3>{`Operations (${opCount})`}</h3>
          <Grid>
            <OperationList limit={opCount} tx={id} />
          </Grid>
        </Row>
      </Grid>
    )
  }
}

Transaction.propTypes = {
  fee: PropTypes.number,
  id: PropTypes.string,
  ledger: PropTypes.number,
  memoType: PropTypes.string,
  operations: PropTypes.array,
  time: PropTypes.string,
  urlFn: PropTypes.func,
}

class TransactionContainer extends React.Component {
  state = {
    operations: [],
  }

  componentDidMount() {
    const id = this.props.match.params.id
    const server = this.props.server
    server
      .transactions()
      .transaction(id)
      .call()
      .then(res => {
        this.setState({tx: res})
      })
      .catch(handleFetchDataFailure(id))
  }

  render() {
    if (!this.state.tx) return null
    const tx = this.state.tx
    return (
      <Transaction
        id={tx.id}
        fee={tx.fee_paid}
        ledger={tx.ledger_attr}
        memoType={tx.memo_type}
        opCount={tx.operation_count}
        time={tx.created_at}
        urlFn={this.props.server.txURL}
      />
    )
  }
}

export default withServer(TransactionContainer)
