import sinon, {SinonStubbedInstance} from 'sinon'

import {ISoundProvider} from '~src/domain'

export function mock_sound_provider(): SinonStubbedInstance<ISoundProvider> {
    return {
        size: sinon.stub(),
        list: sinon.stub(),
        search: sinon.stub(),
        exists: sinon.stub(),
        get: sinon.stub(),
    }
}
