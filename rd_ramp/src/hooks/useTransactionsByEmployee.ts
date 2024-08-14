import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      if (employeeId === 'all') {
         // Fetch all transactions
        // Adjust the logic according to your pagination or all data fetching strategy
        let allTransactions: Transaction[] = []
        let nextPage: number | null = 0

        do {
          const data = await fetchWithCache<{ data: Transaction[], nextPage: number | null }>("paginatedTransactions", { page: nextPage })
          if (data) {
            allTransactions = [...allTransactions, ...data.data]
            nextPage = data.nextPage
          } else {
            nextPage = null
          }
        } while (nextPage !== null)

        setTransactionsByEmployee(allTransactions)
        return
      }
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId
        }
      );

      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}
