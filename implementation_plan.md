# Update Audio Import Paths and Render Demos

## Goal Description

- Fix 404 errors during Remotion MP4 rendering by ensuring voiceover audio files are correctly bundled.
- Update import paths in `AdminDemo.jsx`, `HustlerDemo.jsx`, and `PosterDemo.jsx` to reference assets inside `src/assets`.
- Run Remotion render commands for `AdminDemo`, `HustlerDemo`, and `PosterDemo` to generate MP4 files with synchronized voiceovers.

## User Review Required

> [!IMPORTANT]
> Ensure that moving audio files to `src/assets` and updating import paths does not affect any other parts of the application.

## Open Questions

> [!WARNING]
> Do you want the generated MP4 files saved in a specific directory (e.g., `out/videos/`), or is the default location acceptable?

## Proposed Changes

---
### [MODIFY] [AdminDemo.jsx](file:///C:/Users/user/SideQuestBN/src/remotion/scenes/AdminDemo.jsx)
- Update import statements to use `src/assets`.

---
### [MODIFY] [HustlerDemo.jsx](file:///C:/Users/user/SideQuestBN/src/remotion/scenes/HustlerDemo.jsx)
- Update import statements to use `src/assets`.

---
### [MODIFY] [PosterDemo.jsx](file:///C:/Users/user/SideQuestBN/src/remotion/scenes/PosterDemo.jsx)
- Update import statements to use `src/assets`.

---
### [NEW] Render Commands (background tasks)
- `npx remotion render src/remotion/index.jsx AdminDemo out/AdminDemo.mp4`
- `npx remotion render src/remotion/index.jsx HustlerDemo out/HustlerDemo.mp4`
- `npx remotion render src/remotion/index.jsx PosterDemo out/PosterDemo.mp4`

## Verification Plan

### Automated Tests
- Run the three render commands and verify that MP4 files are created without 404 errors.
- Check that audio plays correctly and syncs with subtitles.

### Manual Verification
- Open each MP4 file and confirm voiceover audio is present and matches the caption text.
