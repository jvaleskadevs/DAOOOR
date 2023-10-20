import {
  Approval as ApprovalEvent,
  DAOCreated as DAOCreatedEvent,
  DAOJoined as DAOJoinedEvent,
  OperatorSet as OperatorSetEvent,
  Transfer as TransferEvent
} from "../generated/DAORegistry/DAORegistry"
import {
  Approval,
  DAOCreated,
  DAOJoined,
  OperatorSet,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.DAORegistry_id = event.params.id
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDAOCreated(event: DAOCreatedEvent): void {
  let entity = new DAOCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.daoTba = event.params.daoTba
  entity.daoId = event.params.daoId
  entity.daoGovernor = event.params.daoGovernor
  entity.daoUri = event.params.daoUri

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDAOJoined(event: DAOJoinedEvent): void {
  let entity = new DAOJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.member = event.params.member
  entity.daoId = event.params.daoId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOperatorSet(event: OperatorSetEvent): void {
  let entity = new OperatorSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.caller = event.params.caller
  entity.sender = event.params.sender
  entity.receiver = event.params.receiver
  entity.DAORegistry_id = event.params.id
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
