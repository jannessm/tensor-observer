from urllib.request import Request, urlopen
from time import time
import json

class TensorObserver():
    API = 'http://localhost:8080'

    def constructor(self, endpoint='http://localhost:8080'):
        self.API = endpoint

    def scalar(self, scalar, run, tag, step, wall_time=None):
        if wall_time is None:
            wall_time = time()
        data = {
            'type': 'scalar',
            'scalar': scalar,
            'run': run,
            'tag': tag,
            'step': step,
            'wall_time': wall_time
        }

        self._post(data)

    def exception(self, e, run, wall_time=None):
        if wall_time is None:
            wall_time = time()
        data = {
            'type': 'exception',
            'exception': str(e),
            'run': run,
            'wall_time': wall_time
        }

        self._post(data)

    def end_signal(self, run, wall_time=None):
        if wall_time is None:
            wall_time = time()
        data = {
            'type': 'end_signal',
            'run': run,
            'wall_time': wall_time
        }

        self._post(data)

    def _post(self, data):
        try:
            request = Request(
                self.API,
                data=json.dumps(data).encode('utf8'),
                headers={'content-type': 'application/json'}
            )
            urlopen(request)
        except Exception as e:
            print('TensorObserver for API <%s>:' % self.API, e, file=sys.stderr)
            pass

if __name__ == '__main__':
    from time import sleep
    from random import random, randint

    api = TensorObserver()

    runs = ['a_cool_net', 'another_one', 'some_exp', 'nice']
    tags = ['accuracy', 'loss']
    exceptions = ['broke', 'smth went wrong', 'cool error dude!']

    for i in range(100):
        if random() < 0.5:
            api.scalar(
                random(),
                runs[randint(0,3)],
                tags[randint(0,1)],
                i,
                time()
            )
        else:
            api.exception(
                Exception(exceptions[randint(0,2)]),
                runs[randint(0,3)],
                time()
            )
        sleep(1)
    
    api.exception(
        Exception(exceptions[randint(0,2)]),
        runs[randint(0,3)],
        time()
    )