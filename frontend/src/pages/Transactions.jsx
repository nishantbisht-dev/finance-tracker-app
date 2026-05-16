import { useEffect, useState } from "react";
import TransactionModal from "../components/TransactionModal";
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from "../services/transactionService";
import toast from "react-hot-toast";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);

            let params = `?page=${page}&limit=10`;
            if (type) params += `&type=${type}`;
            if (category) params += `&category=${category}`;
            if (search) params += `&search=${search}`;

            const res = await getTransactions(params);
            setTransactions(res.transactions || []);
            setPages(res.pages || 1);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const handleFilter = (e) => {
        e.preventDefault();
        setPage(1);
        fetchTransactions();
    };

    const handleAdd = async (data) => {
        try {
            await createTransaction(data);
            toast.success("Transaction added");
            setModalOpen(false);
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add transaction");
        }
    };

    const handleEdit = async (data) => {
        try {
            await updateTransaction(editingTransaction._id, data);
            toast.success("Transaction updated");
            setEditingTransaction(null);
            setModalOpen(false);
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update transaction");
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Delete this transaction?");
        if (!confirm) return;

        try {
            await deleteTransaction(id);
            toast.success("Transaction deleted");
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete transaction");
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 lg:flex-row lg:items-end lg:justify-between">
                <form onSubmit={handleFilter} className="grid gap-4 md:grid-cols-4 lg:flex-1">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search title..."
                        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category..."
                        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <button
                        type="submit"
                        className="rounded-xl bg-indigo-500 px-4 py-3 font-medium hover:bg-indigo-600"
                    >
                        Filter
                    </button>
                </form>

                <button
                    onClick={() => {
                        setEditingTransaction(null);
                        setModalOpen(true);
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium hover:bg-white/10"
                >
                    + Add Transaction
                </button>
            </div>

            {error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-300">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                <table className="min-w-[800px] w-full text-left">
                    <thead className="bg-white/5 text-sm text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                        {loading ? (
                            <tr>
                                <td className="px-4 py-6 text-slate-400" colSpan="6">
                                    Loading...
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-slate-400" colSpan="6">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t._id} className="text-sm">
                                    <td className="px-4 py-3">{t.title}</td>
                                    <td className="px-4 py-3 text-slate-400">{t.category}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${t.type === "income"
                                                    ? "bg-emerald-500/15 text-emerald-400"
                                                    : "bg-rose-500/15 text-rose-400"
                                                }`}
                                        >
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">
                                        {t.date ? new Date(t.date).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(t)}
                                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm text-slate-400">
                    Page {page} of {pages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, pages))}
                    disabled={page === pages}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <TransactionModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingTransaction(null);
                }}
                onSubmit={editingTransaction ? handleEdit : handleAdd}
                initialData={editingTransaction}
            />
        </div>
    );
}

export default Transactions;