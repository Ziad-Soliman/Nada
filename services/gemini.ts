// This service has been deprecated as the app now uses a local question database.
// The file is kept to prevent import errors during transition, but it exports nothing useful.

export const generateWordProblemText = async (): Promise<string> => {
  return "Error: AI Service Disabled.";
};
