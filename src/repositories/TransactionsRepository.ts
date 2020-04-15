import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomes = this.transactions.filter(
      transaction => transaction.type === 'income',
    );

    const incomeValues = incomes.map(income => income.value);

    const totalIncome = incomeValues.reduce((acc, obj) => {
      return acc + obj;
    }, 0);

    const outcomes = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const outcomeValues = outcomes.map(income => income.value);

    const totalOutcome = outcomeValues.reduce((acc, obj) => {
      return acc + obj;
    }, 0);

    return {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw Error('Não é possível registrar valor negativo.');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
