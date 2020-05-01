import { ClientCommand } from '../domain';

export interface IDispatcher {
    dispatch(client_command: ClientCommand): Promise<void>
}
