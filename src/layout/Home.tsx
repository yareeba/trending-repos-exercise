import {
  Box,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { Repository } from "../types";
import useGetRepositories from "../services/useGetRepositories";
import RepositoryCard from "./components/RepositoryCard";

const Home = () => {
  const [favouriteRepos, setFavouriteRepos] = useState<Repository[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string>("All");

  const { data: trendingRepos = [], isError, isLoading } = useGetRepositories();

  useEffect(() => {
    const favRepos = localStorage.getItem("favouriteRepos");

    if (typeof favRepos === "string") {
      setFavouriteRepos(JSON.parse(favRepos));
    }
  }, []);

  const repositoryLanguages = useMemo(() => {
    return [...trendingRepos, ...favouriteRepos].reduce(
      (acc: string[], repo: Repository) => {
        if (!repo.language || acc.includes(repo.language)) return acc;

        return [...acc, repo.language];
      },
      []
    );
  }, [trendingRepos, favouriteRepos]);

  const filteredTrendingRepos = useMemo(() => {
    if (languageFilter === "All") return trendingRepos;

    return trendingRepos.filter((r) => r.language === languageFilter);
  }, [languageFilter, trendingRepos]);

  const filteredFavouriteRepos = useMemo(() => {
    if (languageFilter === "All") return favouriteRepos;

    return favouriteRepos.filter((r) => r.language === languageFilter);
  }, [languageFilter, favouriteRepos]);

  const onClickFavourite = (repo: Repository) => {
    if (favouriteRepos.find((r) => r.id === repo.id)) {
      const updatedRepos = [...favouriteRepos];
      updatedRepos.splice(
        favouriteRepos.findIndex((r) => r.id === repo.id),
        1
      );

      setFavouriteRepos(updatedRepos);
      localStorage.setItem("favouriteRepos", JSON.stringify(updatedRepos));
    } else {
      setFavouriteRepos([repo, ...favouriteRepos]);
      localStorage.setItem(
        "favouriteRepos",
        JSON.stringify([repo, ...favouriteRepos])
      );
    }
  };

  return (
    <Box margin={4}>
      <Flex direction="row" justifyContent="space-between" margin={4}>
        <Heading as="h1">Trending Repositories</Heading>
        <Select
          defaultValue="All"
          width="xl"
          aria-label="Filter by language"
          onChange={(e) => setLanguageFilter(e.target.value)}
          isDisabled={isLoading || isError}
        >
          <option value="All">All</option>
          {repositoryLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
      </Flex>
      <Skeleton isLoaded={!isLoading} height="300px">
        {isError ? (
          <Flex height="200px" justifyContent="center" alignItems="center">
            There has been an error loading the data!
          </Flex>
        ) : (
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList marginLeft={2}>
              <Tab>All</Tab>
              <Tab isDisabled={favouriteRepos.length == 0}>Favourites</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex direction="column" gap={2}>
                  {filteredTrendingRepos.map((repo) => {
                    return (
                      <RepositoryCard
                        key={repo.id}
                        repository={repo}
                        onClickFavourite={onClickFavourite}
                        isFavourite={
                          !!favouriteRepos.find((r) => r.id === repo.id)
                        }
                      />
                    );
                  })}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction="column" gap={2}>
                  {filteredFavouriteRepos.map((repo) => {
                    return (
                      <RepositoryCard
                        key={`favourite-${repo.id}`}
                        repository={repo}
                        onClickFavourite={onClickFavourite}
                        isFavourite={true}
                      />
                    );
                  })}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Skeleton>
    </Box>
  );
};

export default Home;
