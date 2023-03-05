import { RepositoriesData, Repository } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const useGetRepositories = (): UseQueryResult<Repository[], AxiosError> => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const month = sevenDaysAgo.getMonth() + 1
  const dateString = `${sevenDaysAgo.getFullYear()}-${month > 9 ? month : "0" + month}-${sevenDaysAgo.getDate()}`

  return useQuery(['repositories', dateString],
  async () => {
    const { data } = await axios.get<RepositoriesData>(
      `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc`
    );

    return data.items
  }
  )
}

export default useGetRepositories
