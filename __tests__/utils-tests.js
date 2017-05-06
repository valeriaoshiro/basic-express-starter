/* global
    jest
    describe
    it
    expect
    beforeEach
    afterEach
*/
jest.unmock('../ui/js/utils');

import sinon from 'sinon';
import * as Util from '../ui/js/utils';

describe('getJSON', () => {
    let server;
        let successResp;
        let response = {
            "one": 1,
            "two": 2
        };

        let headers = { "Content-Type": "application/json" };

        beforeEach((done) => {
            server = sinon.fakeServer.create();
            // server.autoRespond = true;

            server.respondWith(/things/g, [
                200,
                headers,
                JSON.stringify(response)
            ]);
            done();
        });

        afterEach( () => {
            server.restore();
        });
        it('Should get data from a server', (done) => {
            Util.getJSON('/things').then(
                (resp) => {
                    successResp = resp;
                    expect(successResp).toEqual(response);
                    // expect(server.requests[0].url.includes('?')).toBe(true);
                    done();
                },
                () => {
                    done.fail('Successful request test case has failed');
                }
            );
            server.respond();
        });

        it('Should create the correct url string', (done) => {
            Util.getJSON('/things?something=xyz&').then(
                () => {
                    let url = server.requests[0].url;
                    expect(url.includes('&&')).toBe(false);
                    done();
                }
            );
            server.respond();
        });
});
