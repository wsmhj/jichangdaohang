import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as jsonc from 'jsonc-parser';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const articlesJsonPath = 'data/json/articles.json';
const mdFolderPath = 'data/md';

// 同步文章数据
export async function syncArticles() {
  try {
    // 获取所有MD文件
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path: mdFolderPath,
    });

    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    const articles = await Promise.all(mdFiles.map(async file => {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const { data: frontMatter } = matter(content);

      // 获取文件的最后提交信息
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        path: file.path,
        per_page: 1
      });

      const lastModified = commits[0]?.commit.committer.date || new Date().toISOString();

      return {
        title: frontMatter.title,
        description: frontMatter.description,
        date: frontMatter.date,
        lastModified: lastModified,
        path: file.path,
      };
    }));

    // 更新 articles.json
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: articlesJsonPath,
      message: '同步文章数据',
      content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
      sha: currentFile.sha,
    });

    // 更新本地文件
    const localPath = path.join(process.cwd(), 'data', 'json', 'articles.json');
    fs.writeFileSync(localPath, JSON.stringify(articles, null, 2));

    return articles;
  } catch (error) {
    console.error('同步文章时出错:', error);
    throw error;
  }
}

// 同步工具网站数据
export async function syncWebsiteData(locale = 'zh') {
  try {
    // 先同步目录
    const categoryPath = `data/json/${locale}/tools/category.jsonc`;
    const { data: categoryFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: categoryPath,
    });

    const categoryContent = Buffer.from(categoryFile.content, 'base64').toString('utf8');
    const categories = jsonc.parse(categoryContent);

    // 更新本地目录文件
    const localCategoryPath = path.join(process.cwd(), 'data', 'json', locale, 'tools', 'category.jsonc');
    fs.writeFileSync(localCategoryPath, categoryContent);

    // 同步每个分类的工具
    for (const category of categories) {
      if (!category.src) continue;
      
      const toolPath = `data/json/${locale}/tools/${category.src}`;
      try {
        const { data: toolFile } = await octokit.repos.getContent({
          owner,
          repo,
          path: toolPath,
        });

        const toolContent = Buffer.from(toolFile.content, 'base64').toString('utf8');
        
        // 更新本地工具文件
        const localToolPath = path.join(process.cwd(), 'data', 'json', locale, 'tools', category.src);
        fs.writeFileSync(localToolPath, toolContent);
      } catch (error) {
        console.error(`同步工具 ${category.src} 时出错:`, error);
        // 继续处理其他工具
      }
    }

    return true;
  } catch (error) {
    console.error('同步网站数据时出错:', error);
    throw error;
  }
}

// 完整同步所有数据
export async function syncAllData() {
  try {
    await syncArticles();
    await syncWebsiteData('zh');
    await syncWebsiteData('en');
    return { success: true, message: '所有数据同步成功' };
  } catch (error) {
    console.error('同步所有数据时出错:', error);
    return { success: false, message: '同步数据时出错: ' + error.message };
  }
} 