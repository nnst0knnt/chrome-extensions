export const addErrorClass = (
  element: HTMLElement,
  options: { duration?: number; classNames?: string[] } = { duration: 3000, classNames: [] }
) => {
  element.classList.add('error', ...(options.classNames || []));

  setTimeout(() => {
    element.classList.remove('error');
  }, options.duration);
};
