CON CO WEB V16 — CONTENT PATCH

This is a PATCH for the existing V15 website, not a complete replacement ZIP.

WHAT IT UPDATES
- Replaces the 30 quiz questions with the question bank from:
  "BO 30 CAU HOI TRAC NGHIEM TIM HIEU VE DAO CON CO CT.docx"
- Fixes the answer mapping for question 7: the correct answer is option C ("Đặc khu Cồn Cỏ"). The Word document's answer table labels it D even though the text is option C.
- Replaces the five old reading tabs with seven topic modules based on:
  "Noi_dung_Con_Co_ao_va_tai_lieu_tham_khao_cap_nhat_phan_6_7.docx"
- Replaces the old historical source-literacy mini-game with seven "Em làm chủ Cồn Cỏ" sustainability scenarios.
- Adds the Gallery page using image files already uploaded to the parent GitHub repository.
- Adds a separate Unity 3D tab and an empty unity-build/ folder where your own Unity WebGL export can be copied.
- Adds Be Vietnam Pro as the display font, with Arial fallback.
- Resets the old exam attempt storage so the updated quiz appears instead of a previous V15 attempt.

INSTALL ON UBUNTU
1. Extract your original con-co-web-v15.zip.
2. Extract this patch ZIP.
3. Open Terminal in the folder containing both extracted folders.
4. Run:
   python3 con-co-web-v16-content-patch/apply_v16.py con-co-web-v15

If the folders are somewhere else, replace the last argument with the full path to your extracted V15 folder.

UNITY
After making a WebGL build in Unity, copy ALL generated files and folders into:
con-co-web-v15/unity-build/
The resulting player entry file must be:
con-co-web-v15/unity-build/index.html
Do not copy only index.html; the Unity WebAssembly, data and JavaScript files are also needed.

NOTES
- The image gallery loads the image files from the public GitHub repository using raw.githubusercontent.com. Internet access is needed to display them.
- The ranking/profile features from a separate earlier patch are not included in this content patch.
- This installer modifies the extracted local V15 folder. It does not push changes to GitHub. The GitHub integration rejected branch creation with HTTP 403 during this task.
- The Unity page is a ready-made embed location only; no Unity game is included.
