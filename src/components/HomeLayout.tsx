import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddMovie } from "./HomeReducer";

function HomeLayout() {
  const [movies, setMovies] = useState<any[]>([1]);
  const [filter, setFilter] = useState<string>("");

  const { selectedMovie, isFetching } = useSelector(
    (state: any) => state.movies
  );
  const dispatch = useDispatch();

  const handleOnclick = (item: any) => {
    dispatch(AddMovie(item));
  };

  useEffect(() => {
    axios
      .get<any>("https://swapi.dev/api/films/?format=json")
      .then((data) => setMovies(data.data.results));
  }, []);

  const [filterParam, setFilterParam] = useState<string>("title");

  const filteredFilms = movies.filter((film) => {
    if (filterParam === "title") {
      return film.title.toLowerCase().includes(filter.toLowerCase());
    } else if (filterParam === "episode_id") {
      return film.episode_id
        .toString()
        .toLowerCase()
        .includes(filter.toLowerCase());
    } else if (filterParam === "release_date") {
      return film.release_date.toLowerCase().includes(filter.toLowerCase());
    }
    return film.title.toLowerCase().includes(filter.toLowerCase());
  });

  function convertToRomanNumeral(episodeNumber: number): string {
    const romanNumerals = [
      { value: 1000, numeral: "M" },
      { value: 900, numeral: "CM" },
      { value: 500, numeral: "D" },
      { value: 400, numeral: "CD" },
      { value: 100, numeral: "C" },
      { value: 90, numeral: "XC" },
      { value: 50, numeral: "L" },
      { value: 40, numeral: "XL" },
      { value: 10, numeral: "X" },
      { value: 9, numeral: "IX" },
      { value: 5, numeral: "V" },
      { value: 4, numeral: "IV" },
      { value: 1, numeral: "I" },
    ];

    let romanNumeral = "";
    for (let i = 0; i < romanNumerals.length; i++) {
      while (episodeNumber >= romanNumerals[i].value) {
        romanNumeral += romanNumerals[i].numeral;
        episodeNumber -= romanNumerals[i].value;
      }
    }
    return romanNumeral;
  }

  return (
    <div>
      <div className="input-group mb-3" style={{ padding: "10px 0 0 10px" }}>
        <div className="input-group-prepend">
          <select
            name=""
            id=""
            onClick={(e) =>
              setFilterParam((e.target as HTMLSelectElement).value)
            }
          >
            <option value="title">name</option>
            <option value="episode_id">episode</option>
            <option value="release_date">date</option>
          </select>
        </div>
        <div style={{ display: "flex" }}>
          <input
            value={filter}
            type="text"
            className="form-control"
            placeholder="Type to search..."
            aria-label="Text input with dropdown button"
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "650px" }}
          />
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <table className="table" style={{ width: "50%" }}>
          <tbody>
            {filteredFilms.map((item: any, index) => {
              return (
                <tr key={index}>
                  <td>EPISODE {item.episode_id}</td>
                  <td onClick={() => handleOnclick(item)}>
                    Episode {convertToRomanNumeral(item.episode_id)} -{" "}
                    {item.title}
                  </td>
                  <td>{item.release_date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ width: "50%", padding: "0 30px", cursor: "pointer" }}>
          {isFetching ? (
            <>
              <div>
                <h3>
                  {" "}
                  Episode {convertToRomanNumeral(
                    selectedMovie.episode_id
                  )} - {selectedMovie.title}
                </h3>
                <p>{selectedMovie.opening_crawl}</p>
                <br />
                <p>Directed by : {selectedMovie.director}</p>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4>No movie selected</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeLayout;
