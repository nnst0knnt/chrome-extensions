import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { ThemeToggle } from '@/components';
import { Control } from '@/features/control';
import {
  Container,
  Divider,
  LoggingOptions,
  ModeOptions,
  ReactivateOptions,
  StateToggle,
  Title,
} from '@/features/control/components';

import { Home } from '.';

describe('Home', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(Control, 'replace').mockImplementation(async (node) => {
      document.documentElement.replaceChildren(node);
    });
    vi.spyOn(Title, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(Container, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(Divider, 'build').mockReturnValue(document.createElement('div'));
    vi.spyOn(ModeOptions, 'build').mockResolvedValue(document.createElement('div'));
    vi.spyOn(ReactivateOptions, 'build').mockResolvedValue(document.createElement('div'));
    vi.spyOn(LoggingOptions, 'build').mockResolvedValue(document.createElement('div'));
    vi.spyOn(StateToggle, 'build').mockResolvedValue(document.createElement('label'));
    vi.spyOn(ThemeToggle, 'build').mockResolvedValue(document.createElement('div'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ポップアップでコントローラー画面を表示すること', async () => {
    await Home.render();

    expect(Title.build).toHaveBeenCalledWith();
    expect(Container.build).toHaveBeenCalled();
    expect(Divider.build).toHaveBeenCalled();
    expect(ModeOptions.build).toHaveBeenCalled();
    expect(ReactivateOptions.build).toHaveBeenCalled();
    expect(LoggingOptions.build).toHaveBeenCalled();
    expect(StateToggle.build).toHaveBeenCalled();
    expect(ThemeToggle.build).toHaveBeenCalled();
    expect(Control.replace).toHaveBeenCalled();
    expect(document.querySelector('.gpp-control-wrapper')).not.toBeNull();
    expect(document.querySelector('.gpp-control-bottom-wrapper')).not.toBeNull();
  });
});
