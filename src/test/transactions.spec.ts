import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import supertest from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";

describe('Transactions Routes', () => {
    beforeAll(async () => {
        await app.ready();
    });
    
    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        execSync('npm run knex migrate:rollback --all');
        execSync('npm run knex migrate:latest');
    });
    
    it('should be able to create a new transaction', async () => {
        await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201);
    
    });

    it('should be able to list all transaction', async () => {

        const createTransactionResponse = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            });

        const cookies = createTransactionResponse.get('Set-Cookie') as string[];

        const listTransactionResponse = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            })
        ]);
    });


    it('should be able to get a specific transaction', async () => {

        const createTransactionResponse = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            });

        const cookies = createTransactionResponse.get('Set-Cookie') as string[];
       
        const listTransactionResponse = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        const transactionId = listTransactionResponse.body.transactions[0].id;

        const getTransactionResponse = await supertest(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            })
        );
    });

    it('should be able to get the summary', async () => {

        const createTransactionResponse = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit'
            });

        const cookies = createTransactionResponse.get('Set-Cookie') as string[];

        await supertest(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send({
            title: 'New Transaction',
            amount: 2000,
            type: 'debit'
        }); 
       
        const summaryResponse = await supertest(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200)

        expect(summaryResponse.body.summary).toEqual({
            amount: 3000
        });
    });
});
