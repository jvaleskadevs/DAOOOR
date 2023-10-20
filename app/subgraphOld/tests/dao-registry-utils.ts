import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  DAOCreated,
  DAOJoined,
  OperatorSet,
  Transfer
} from "../generated/DAORegistry/DAORegistry"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  id: BigInt,
  amount: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return approvalEvent
}

export function createDAOCreatedEvent(
  daoTba: Address,
  daoId: BigInt,
  daoGovernor: Address,
  daoUri: string
): DAOCreated {
  let daoCreatedEvent = changetype<DAOCreated>(newMockEvent())

  daoCreatedEvent.parameters = new Array()

  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("daoTba", ethereum.Value.fromAddress(daoTba))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("daoId", ethereum.Value.fromUnsignedBigInt(daoId))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "daoGovernor",
      ethereum.Value.fromAddress(daoGovernor)
    )
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("daoUri", ethereum.Value.fromString(daoUri))
  )

  return daoCreatedEvent
}

export function createDAOJoinedEvent(
  member: Address,
  daoId: BigInt
): DAOJoined {
  let daoJoinedEvent = changetype<DAOJoined>(newMockEvent())

  daoJoinedEvent.parameters = new Array()

  daoJoinedEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )
  daoJoinedEvent.parameters.push(
    new ethereum.EventParam("daoId", ethereum.Value.fromUnsignedBigInt(daoId))
  )

  return daoJoinedEvent
}

export function createOperatorSetEvent(
  owner: Address,
  spender: Address,
  approved: boolean
): OperatorSet {
  let operatorSetEvent = changetype<OperatorSet>(newMockEvent())

  operatorSetEvent.parameters = new Array()

  operatorSetEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  operatorSetEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  operatorSetEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return operatorSetEvent
}

export function createTransferEvent(
  caller: Address,
  sender: Address,
  receiver: Address,
  id: BigInt,
  amount: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return transferEvent
}
