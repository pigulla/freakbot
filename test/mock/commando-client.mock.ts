import sinon, {SinonStubbedInstance} from 'sinon'

import {ICommandoClient} from '../../src/domain'

export function mock_commando_client(): SinonStubbedInstance<ICommandoClient> {
    return {
        get_client: sinon.stub(),
    }
}
