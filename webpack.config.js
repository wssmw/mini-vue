const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode:'none',
    entry:'./src/index.js',
    output:{
        filename:'mini-vue.js',
        path:path.resolve(__dirname,'dist'),
        clean:true
    },
    devServer:{
        static:'./dist'
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./index.html',//模板是基于什么
            filename:'app.html',//生成的html文件的名字
            inject:'body'//生成的script那引入
        })
    ]
}