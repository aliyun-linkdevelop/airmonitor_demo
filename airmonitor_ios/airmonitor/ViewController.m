//
//  ViewController.m
//  airmonitor
//
//  Created by LinkDevelop on 10/02/2018.
//  Copyright © 2018 Aliyun. All rights reserved.
//

#import "ViewController.h"

#import <IMSApiClient/IMSApiClient.h>

#import <IMSRouter/IMSRouter.h>

#import <IMSBoneKit/BoneRCTViewController.h>

@interface ViewController ()
@property (nonatomic, strong)   NSArray         *deviceStatus;
@property (nonatomic, strong)   NSDictionary    *unitForStatus;
@property (nonatomic, weak)     NSTimer         *refreshTimer;
@end

@implementation ViewController

- (void)dealloc {
    [self.refreshTimer invalidate];
}


- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSURL *url = [NSURL URLWithString:@"link://__YOUR_MOBILE_PLUGIN_ID__"];
    NSDictionary *params = @{
                             @"ProductKey": @"__YOUR_DEVICE_PRODUCT_KEY__",
                             @"DeviceName": @"__YOUR_DEVICE_NAME__"
                             };
    [[IMSRouterService sharedService] openURL:url
                                      options:params
                            completionHandler:^(BOOL success) {
                                if (success) {
                                    NSLog(@"插件打开成功");
                                } else {
                                    NSLog(@"插件打开失败");
                                }
                            }];
}


- (void)queryDeviceStatus {
    // 构建请求
    NSDictionary *params = @{
                             @"ProductKey": @"__YOUR_DEVICE_PRODUCT_KEY__",
                             @"DeviceName": @"__YOUR_DEVICE_NAME__",
                             };
    IMSIoTRequestBuilder *builder = [[IMSIoTRequestBuilder alloc] initWithPath:@"/thing/device/status/query"
                                                                    apiVersion:@"1.0.1"
                                                                        params:params];
    
    //通过 IMSRequestClient 发送请求
    [IMSRequestClient asyncSendRequest:builder.build responseHandler:^(NSError * _Nullable error, IMSResponse * _Nullable response) {
        if (error) {
            //处理Error，非服务端返回的错误都通过该Error回调
        } else {
            if (response.code == 200) {
                //成功，处理response.data
                self.deviceStatus = response.data;
                [self.tableView reloadData];
            } else {
                //处理服务端错误，可通过response.localizedMsg展示错误Toast
            }
        }
    }];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


#pragma mark - TableView delegate

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.deviceStatus.count;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DataCell"];
    NSDictionary *status = self.deviceStatus[indexPath.row];
    cell.textLabel.text = status[@"attribute"];
    cell.detailTextLabel.text = [[status[@"value"] description] stringByAppendingString:self.unitForStatus[status[@"attribute"]]];
    return cell;
}


@end
