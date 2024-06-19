export const fetchPreview = async () => {
  const response = await fetch('https://podcast-api.netlify.app');
  if (!response.ok) throw new Error('Failed to fetch preview data');
  return response.json();
};

export const fetchGenre = async (id) => {
  const response = await fetch(`https://podcast-api.netlify.app/genre/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch genre data for id ${id}`);
  return response.json();
};

export const fetchShow = async (id) => {
  const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch show data for id ${id}`);
  return response.json();
};