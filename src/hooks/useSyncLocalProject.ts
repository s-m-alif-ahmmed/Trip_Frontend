const useSyncLocalProject = (name: string): void => {
  const storedName = localStorage.getItem("projectName");
  if (storedName !== name) {
    localStorage.clear();
    localStorage.setItem("projectName", name);
  }
};

export default useSyncLocalProject;
