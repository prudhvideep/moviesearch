import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from "./config/config-helper";

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => (
          <div className="App min-h-screen flex flex-col bg-gray-100">
            <ErrorBoundary>
              <Layout
                header={
                  <div className="bg-white shadow-md p-4">
                    <SearchBox autocompleteSuggestions={true} />
                  </div>
                }
                sideContent={
                  <div className="bg-white shadow-md p-4 flex flex-col space-y-4">
                    {wasSearched && (
                      <Sorting
                        label="Sort by"
                        sortOptions={buildSortOptionsFromConfig()}
                      />
                    )}
                    {getFacetFields().map((field) => (
                      <Facet
                        key={field}
                        field={field}
                        label={field}
                        className="bg-gray-50 p-2 rounded-lg shadow"
                      />
                    ))}
                  </div>
                }
                bodyContent={
                  <div className="flex-1 bg-white shadow-md p-4 rounded-lg">
                    <Results
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      thumbnailField={getConfig().thumbnailField}
                      shouldTrackClickThrough={true}
                    />
                  </div>
                }
                bodyHeader={
                  <div className="flex justify-between items-center">
                    {wasSearched && <PagingInfo className="text-gray-700" />}
                    {wasSearched && <ResultsPerPage className="text-gray-700" />}
                  </div>
                }
                bodyFooter={
                  <div className="flex justify-center mt-4">
                    <Paging className="text-gray-700" />
                  </div>
                }
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
