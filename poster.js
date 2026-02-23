/**
 * poster.js - 浏览器版海报绘制
 * 依赖：HTML中需存在一个指定ID的canvas元素
 * 用法：
 *   drawPoster('posterCanvas', {
 *     avatar: '...',  // 头像图片URL或dataURL
 *     title: '萌娃金句',
 *     logo: 'logo.png',
 *     qr: 'qr.png'
 *   }, (posterDataURL) => {
 *     console.log('海报生成', posterDataURL);
 *   });
 */

(function(global) {
  'use strict';

  /**
   * 绘制海报主函数
   * @param {string|HTMLCanvasElement} canvas - canvas的ID或canvas元素
   * @param {Object} options - 配置项
   * @param {string} options.avatar - 头像图片URL或dataURL
   * @param {string} options.title - 标题文字（支持换行）
   * @param {string} options.logo - logo图片URL
   * @param {string} options.qr - 二维码图片URL
   * @param {Function} [callback] - 完成回调，参数为海报dataURL
   * @returns {Promise<string>} 海报dataURL
   */
  function drawPoster(canvas, options, callback) {
    // 获取canvas元素和上下文
    const canvasEl = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
    if (!canvasEl) {
      throw new Error('Canvas元素不存在');
    }
    const ctx = canvasEl.getContext('2d');
    const width = canvasEl.width;
    const height = canvasEl.height;

    // 清空画布，白色背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 默认值
    const title = options.title || '萌娃金句';

    // 收集所有需要加载的图片
    const images = [];

    // 头像（必需）
    if (options.avatar) {
      images.push({ key: 'avatar', url: options.avatar });
    }

    // logo（可选）
    if (options.logo) {
      images.push({ key: 'logo', url: options.logo });
    }

    // 二维码（可选）
    if (options.qr) {
      images.push({ key: 'qr', url: options.qr });
    }

    // 如果没有图片需要加载，直接绘制文字和其他元素
    if (images.length === 0) {
      drawTextAndLogo(ctx, title);
      return finish();
    }

    // 加载所有图片
    let loadedCount = 0;
    const loadedImages = {};

    function onImageLoad(key, img) {
      loadedImages[key] = img;
      loadedCount++;
      if (loadedCount === images.length) {
        // 所有图片加载完成，开始绘制
        render();
      }
    }

    function onImageError(key, err) {
      console.warn(`图片加载失败: ${key}`, err);
      loadedCount++;
      if (loadedCount === images.length) {
        // 即使失败也继续绘制（跳过失败的图片）
        render();
      }
    }

    images.forEach(item => {
      const img = new Image();
      // 如果是dataURL或同源图片，不需要crossOrigin；但如果是跨域图片，可能需要
      // 简单判断：不是dataURL且不是同源时设置crossOrigin（可选）
      if (item.url.indexOf('data:') !== 0 && !item.url.startsWith(location.origin)) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => onImageLoad(item.key, img);
      img.onerror = (e) => onImageError(item.key, e);
      img.src = item.url;
    });

    // 绘制函数（所有图片加载完成后调用）
    function render() {
      // 1. 绘制头像（圆形裁剪）
      if (loadedImages.avatar) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(300, 200, 80, 0, 2 * Math.PI); // 圆心 (300,200)，半径80
        ctx.clip();
        ctx.drawImage(loadedImages.avatar, 220, 120, 160, 160); // 绘制在圆形区域内
        ctx.restore();
      } else {
        // 可绘制占位图或留空
      }

      // 2. 绘制标题文字
      ctx.font = '28px sans-serif'; // 可根据实际调整字体
      ctx.fillStyle = '#FF7F00';
      wrapText(ctx, title, 40, 350, 520, 34);

      // 3. 绘制logo
      if (loadedImages.logo) {
        ctx.drawImage(loadedImages.logo, 40, 700, 100, 60);
      }

      // 4. 绘制二维码
      if (loadedImages.qr) {
        ctx.drawImage(loadedImages.qr, 460, 680, 120, 120);
      }

      // 完成，回调
      finish();
    }

    function finish() {
      // 生成dataURL
      const dataURL = canvasEl.toDataURL('image/png');
      if (callback) callback(dataURL);
      return dataURL;
    }

    // 返回Promise以支持异步
    return new Promise((resolve, reject) => {
      // 如果所有图片已加载（例如无图片时），直接resolve
      if (images.length === 0) {
        resolve(finish());
      } else {
        // 用轮询或重写，这里简单用回调完成
        const originalCallback = callback;
        callback = (dataURL) => {
          if (originalCallback) originalCallback(dataURL);
          resolve(dataURL);
        };
      }
    });
  }

  /**
   * 文字换行函数
   * @param {CanvasRenderingContext2D} ctx - canvas上下文
   * @param {string} text - 要绘制的文本
   * @param {number} x - 起始x坐标
   * @param {number} y - 起始y坐标
   * @param {number} maxWidth - 最大宽度
   * @param {number} lineHeight - 行高
   */
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(''); // 按字符分割（中英文均可）
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // 暴露接口
  global.drawPoster = drawPoster;
  global.wrapText = wrapText; // 可选

})(typeof window !== 'undefined' ? window : this);