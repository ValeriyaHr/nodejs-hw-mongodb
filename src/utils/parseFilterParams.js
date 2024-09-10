// src/utils/parseFilterParams.js

const parseIsFavourite = (isFavourite) => {
    if (isFavourite === 'true') return true;
    if (isFavourite === 'false') return false;
    return undefined;
  };

  export const parseFilterParams = (query) => {
    const { isFavourite, contactType } = query;

    const parsedIsFavourite = parseIsFavourite(isFavourite);
    return {
      isFavourite: parsedIsFavourite,
      contactType: contactType,
    };
  };
