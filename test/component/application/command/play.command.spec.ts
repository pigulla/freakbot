import {expect} from 'chai'
import {CommandoMessage} from 'discord.js-commando'
import {describe} from 'mocha'
import sinon from 'sinon'

import {PlayCommand} from '~src/application/command'

import {setup_command_component_test} from './setup-test'

describe('The play command', function () {
    let command: PlayCommand

    beforeEach(async function () {
        const setup = await setup_command_component_test(PlayCommand)

        command = setup.command
    })

    it('should do stuff', async function () {
        const message = ({
            content: '!play 42',
            author: {
                username: 'hairy_potter',
                discriminator: '42',
            },
            reply: sinon.spy(),
        } as unknown) as CommandoMessage

        await expect(command.run(message, ['42'])).to.eventually.equal(null)
    })
})
