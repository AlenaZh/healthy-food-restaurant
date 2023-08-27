import gulp from "gulp";
import plumber from "gulp-plumber";       // Отлавливает ошибки gulp и позволяет не завершать работу сборщика
import sass from "gulp-dart-sass";        // Плагин Sass для Gulp
import postcss from "gulp-postcss";       // Для обработки CSS с использованием несколких плагинов. Анализирует CSS только один раз
import autoprefixer from "autoprefixer";  // Добавление вендорных префиксов
import discardcomments from "postcss-discard-comments"  // Удаление коментариев из CSS 
import concat from "gulp-concat";         // Для объединения нескольких файлов в один
import browser from "browser-sync";       // Запускает сервер, перезагружает страницу в браузуре(-ах) самостоятельно после сохранения изменений в файлах проекта           
import del from "del";                    // Удаление файлов и каталогов

// HTML
export const html = () => {
  return gulp
  .src("source/*.html")      // Выбираем все файлы с расширением html из папки source
  .pipe(gulp.dest("dist"))   // Перемещаем в папку dist
  .pipe(browser.stream());   // Внесение изменений без обновления страницы в браузере (browser-sync)
};

// Styles
export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })    // Выбираем файл style.scss из папки source/sass
    .pipe(plumber())                                        // Отслеживание ошибок
    .pipe(sass().on("error", sass.logError))                // Компиляция SASS в CSS
    .pipe(postcss([autoprefixer, discardcomments]))         // Обработка CSS: добавление вендорных префиксов, удаление комментариев
    .pipe(gulp.dest("dist/css", { sourcemaps: "." }))       // Помещаем полученный CSS файл в папку dist/css вместе с файлом sourcemaps
    .pipe(browser.stream());                                // Внесение изменений без обновления страницы в браузере (browser-sync)
};

// Scripts
export const scripts = () => {
  return gulp
  .src("source/js/*.js")            // Выбираем все файлы с расширением js из папки source/js
  .pipe(concat("script.js"))        // Объединяем файлы в один script.js
  .pipe(gulp.dest("dist/js"))       // Помещаем полученный файл в папку dist/js
  .pipe(browser.stream());          // Внесение изменений без обновления страницы в браузере (browser-sync)
};

// Copy
// Копирование шрифтов и изображений из папки source в папку dist
export const copy = () => {
  return gulp
    .src(["source/fonts/*", "source/img/*"], {
      base: "source",
    })
    .pipe(gulp.dest("dist"))
    .pipe(
      browser.stream({
        once: true,
      })
    );
};

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: "dist",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher
// Отслеживание изменений в файлах
const watcher = () => {
  gulp.watch("source/*.html", gulp.series(html));
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch([
    "source/fonts/*",
    "source/img/*"
  ], gulp.series(copy));
};

// Clean
// Очистка файлов и папок в папке dist
export const clean = () => {
  return del('dist/**');
};

// Build - production сборка 
export const build = gulp.series( 
  clean,
  gulp.parallel(   
    html, 
    styles, 
    scripts, 
    copy
  ),
);

// Default - development сборка (запускается browser-sync, отслеживаются изменения в файлах)
export default gulp.series(
  clean,
  gulp.parallel(   
    html, 
    styles, 
    scripts, 
    copy
  ), 
  gulp.parallel(watcher, server),
);


