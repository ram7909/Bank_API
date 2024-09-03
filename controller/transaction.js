import bcrypt from "bcryptjs";
import { Transaction } from "../Model/Transaction.js";
import { User } from "../Model/user.js";


// Deposit
export const deposit = async (req, res) => {
    const { userId, name, accountType, amount, method, password } = req.body;
    try {
        const minDeposit = 100;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ message: "User Not Found", success: false });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ message: "Invalid Credentials", success: false });
        }

        const checkAmount = minDeposit <= amount
        if (!checkAmount) return res.json({ message: "Minimum Deposit is 100rs", success: false })
        user.balance += amount;
        await user.save();

        const transaction = new Transaction({
            userId,
            items: [{
                name,
                accountType,
                amount,
                balance: user.balance,
                method,
                type: 'deposit'
            }]
        });
        await transaction.save();

        user.transactions.push(transaction._id)
        await user.save()

        res.json({
            message: "Deposit Successful",
            transaction,
            success: true
        });
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false });
    }
};

// Withdraw
export const withdraw = async (req, res) => {
    const { userId, name, accountType, amount, method, password } = req.body;
    try {
        const minWithdraw = 200;
        let user = await User.findById(userId)
        if (!user) {
            return res.josn({ message: "User Not Exist", success: false })
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ message: "Invalid Credentials", success: false });
        }


        const checkAmount = minWithdraw <= amount
        if (!checkAmount) {
            return res.json({ message: "Minimum Withrawal is 200rs", success: false })
        }

        if (user.balance == 0) {
            return res.json({ message: "Your Balance is Zero" })
        }
        else if (user.balance < amount) {
            return res.json({ message: "Your Balance is Low" })
        }
        else {
            user.balance -= amount
        }

        await user.save();

        const transaction = new Transaction({
            userId,
            items: [{
                name,
                accountType,
                amount,
                balance: user.balance,
                method,
                type: 'withdraw'
            }]
        })

        await transaction.save();

        user.transactions.push(transaction._id)
        await user.save();

        res.json({ message: "Withdraw Successfull", transaction, success: true })
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false });
    }
}

// Get User Statement By userId
export const userStatement = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.json({ message: "User Not Found", success: false });
        }

        const transactions = await Transaction.find({ _id: { $in: user.transactions } }).exec();

        const formattedTransactions = transactions.flatMap(transaction =>
            transaction.items.map(item => ({
                transactionId: transaction._id,
                name: item.name,
                type: item.type,
                amount: item.amount,
                balance: item.balance,
                method: item.method,
                transactionDate: item.createdAt
            }))
        );

        res.json({
            message: "User Statement",
            transactions: formattedTransactions,
            success: true
        });
    } catch (error) {
        res.json({ message: "Internal Server Error", success: false });
    }
};
