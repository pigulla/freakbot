import sinon, {SinonStubbedInstance} from 'sinon'

import {ILogger} from '~src/domain'

export function mock_logger(): SinonStubbedInstance<ILogger> {
    const mock = {
        set_level: sinon.stub().callsFake(() => mock),
        child: sinon.stub().callsFake(() => mock),
        child_for_service: sinon.stub().callsFake(() => mock),
        child_for_command: sinon.stub().callsFake(() => mock),
        child_for_controller: sinon.stub().callsFake(() => mock),

        fatal: sinon.stub(),
        error: sinon.stub(),
        warn: sinon.stub(),
        info: sinon.stub(),
        debug: sinon.stub(),
        trace: sinon.stub(),
    } as SinonStubbedInstance<ILogger>

    return mock
}
