import Home from "./Home";
import useGetRepositories from "../services/useGetRepositories";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

jest.mock("../services/useGetRepositories");

const mockTrendingRepositories = [
  {
    id: "1",
    name: "Test Repo 1",
    html_url: "https://www.github.com/test-repo-1",
    description: "Test Repository 1",
    stargazers_count: 400,
    language: "JavaScript",
    updated_at: "2023-03-04T22:15:17Z",
    created_at: "2023-01-18T23:32:32Z",
  },
  {
    id: "2",
    name: "Test Repo 2",
    html_url: "https://www.github.com/test-repo-2",
    description: "Test Repository 2",
    stargazers_count: 300,
    language: "Python",
    updated_at: "2023-03-04T22:15:17Z",
    created_at: "2023-01-18T23:32:32Z",
  },
  {
    id: "3",
    name: "Test Repo 3",
    html_url: "https://www.github.com/test-repo-3",
    description: "Test Repository 3",
    stargazers_count: 200,
    language: null,
    updated_at: "2023-03-04T22:15:17Z",
    created_at: "2023-01-18T23:32:32Z",
  },
];

const mockUseGetRepositories = useGetRepositories as jest.Mock;
mockUseGetRepositories.mockReturnValue({
  data: mockTrendingRepositories,
  isLoading: false,
  isError: false,
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("Home", () => {
  test("renders all the trending repositories", async () => {
    render(<Home />);

    await waitFor(() => screen.getByRole("link", { name: "Test Repo 1" }));
    expect(
      screen.getByRole("link", { name: "Test Repo 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Test Repo 2" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Test Repo 3" })
    ).toBeInTheDocument();
  });

  test("favouriting a repository sets the item in local storage", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => screen.getByRole("link", { name: "Test Repo 1" }));

    expect(localStorage.getItem("favouriteRepos")).toBe(null);
    await user.click(screen.getAllByRole("button", { name: "Favourite" })[0]);
    expect(localStorage.getItem("favouriteRepos")).toBe(
      JSON.stringify([mockTrendingRepositories[0]])
    );
  });

  test("unfavouriting a repository unsets the item in local storage", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => screen.getByRole("link", { name: "Test Repo 1" }));

    expect(localStorage.getItem("favouriteRepos")).toBe(null);
    await user.click(screen.getAllByRole("button", { name: "Favourite" })[0]);
    expect(localStorage.getItem("favouriteRepos")).toBe(
      JSON.stringify([mockTrendingRepositories[0]])
    );
    await user.click(screen.getByRole("button", { name: "Unfavourite" }));
    expect(localStorage.getItem("favouriteRepos")).toBe(JSON.stringify([]));
  });

  test("filters the repositories by language", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => screen.getByRole("link", { name: "Test Repo 1" }));

    await user.selectOptions(
      screen.getByLabelText("Filter by language"),
      "Python"
    );
    expect(
      screen.queryByRole("link", { name: "Test Repo 2" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Test Repo 1" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Test Repo 3" })
    ).not.toBeInTheDocument();
  });

  test("shows error message when request to get repositories errors", () => {
    mockUseGetRepositories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<Home />);

    expect(
      screen.getByText("There has been an error loading the data!")
    ).toBeInTheDocument();
  });
});
