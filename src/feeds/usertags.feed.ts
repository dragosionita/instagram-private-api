import { Feed } from '../core/feed';
import { Expose } from 'class-transformer';
import { UsertagsFeedResponseItemsItem, UsertagsFeedResponseRootObject } from '../responses';

export class UsertagsFeed extends Feed<UsertagsFeedResponseRootObject, UsertagsFeedResponseItemsItem> {
  id: number | string;
  @Expose()
  private nextMaxId: string;

  protected set state(body: UsertagsFeedResponseRootObject) {
    this.moreAvailable = body.more_available;
    this.nextMaxId = body.next_max_id;
  }

  async request(startId: string) {
    const { body } = await this.client.request.send<UsertagsFeedResponseRootObject>({
      url: `/api/v1/usertags/${this.id}/feed/`,
      qs: {
        max_id: startId ? startId : this.nextMaxId,
      },
    });
    this.state = body;
    return body;
  }

  async items(startId: string = null) {
    const body = await this.request(startId);
    return body.items;
  }
}
